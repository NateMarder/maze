import { getInstance } from '../../../events/index';

export const eventServer = getInstance();

export const events = {
  MAZEGAME: {
    GAMESTART: 'MZGAME::START',
    DESTFOUND: 'MZGAME::DESTFOUND',
    GAMEOVER: 'MZGAME::GAMEOVER'
  }
};

/** UserControl Node Events */
eventServer.on(events.MAZEGAME.DESTFOUND, (data, cb) => {
  console.log(`${events.MAZEGAME.DESTFOUND} Event Fired`);
  console.log(data);
  cb(data);
});
