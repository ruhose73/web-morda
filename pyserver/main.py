import json

from flask import Flask, jsonify
from flask_peewee.db import Database

# настройки подключения
DATABASE = {
    'name': 'osm_data_russia',  # укажите свою БД
    'engine': 'peewee.PostgresqlDatabase',
    'user': 'postgres',  # тут юзера своего
    'password': '123456789',  # а тут пароль для подключения к БД
    'host': 'localhost',
}
DEBUG = True
SECRET_KEY = 'ssshhhh'

# создаем приложение, и подключаем к нему peewee БД
app = Flask(__name__)
app.config.from_object(__name__)
db = Database(app)


@app.route("/api/regionborder/")
def border():
    from flask import request
    # считываем значение зума из параметра
    zoom = int(request.args['zoom'])
    # считываем название города
    region = str(request.args['regionName'])

    # формируем полигон
    bounds = [float(i) for i in request.args['bounds'].split(',')]
    bounds_polygon = "POLYGON((" \
                     "{west} {north}," \
                     "{east} {north}," \
                     "{east} {south}," \
                     "{west} {south}," \
                     "{west} {north}" \
                     "))".format(
        west=max(-180, bounds[0]),
        south=bounds[1],
        east=min(180, bounds[2]),
        north=bounds[3],
    )

    # подобранные на глаз, значения сглаживания
    tolerance = {
        1: 60000,
        2: 50000,
        3: 25000,
        4: 12000,
        5: 6000,
        6: 4000,
        7: 1500,
        8: 1000,
        9: 350,
        10: 180,
        11: 80,
        12: 50,
        13: 40,
    }.get(zoom, 0)

    # наш запрос
    q = db.Model.raw("""
    WITH regions AS (
        SELECT
            st_simplifypreservetopology(
              st_intersection(geometry, st_transform(st_geomfromtext(%s, 4326), 3857)),
              %s
            ) AS geometry,
            name as region_name
        FROM osm_boundaries
        WHERE name ~ %s
    )
    SELECT json_build_object(
              'type',   'Feature',
              'geometry', st_asgeojson(st_transform(geometry, 4326))::json,
              'properties', json_build_object(
                'name', region_name
              )
           ) as geometry
    FROM regions
    """, bounds_polygon, tolerance, region)

    # если регионов несколько, то собираем их в список
    geometries = []
    for row in q:
        geometries.append(row.geometry)

    # возвращаем запрос
    return jsonify({
        'geometries': geometries
    })

if __name__ == '__main__':
    app.run()