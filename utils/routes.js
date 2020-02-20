'use strict'

class Routes {
  constructor(app, redisDB){
    this.app = app;
    this.redisDB = redisDB;
  }

  appRoutes(){
    const redisDB = this.redisDB;

    this.app.get('/getRoomStats', (req, res) => {
      Promise.all(['totalRoomCount', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
        const totalRoomCount = values[0];
        const allRooms = JSON.parse(values[1]);
        res.status(200).json({
          'totalRoomCount' : totalRoomCount,
          'fullRooms': allRooms['fullRooms'],
          'emptyRooms': allRooms['emptyRooms']
        })
      })
    })
  }
}