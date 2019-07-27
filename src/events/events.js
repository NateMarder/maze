import { getInstance } from './index';

export const eventServer = getInstance();

export const events = {
  MAZEGAME: {
    GAMESTART: 'MZGAME::START',
    DESTFOUND: 'MZGAME::DESTFOUND',
    GAMEOVER: 'MZGAME::GAMEOVER',
  },
};

/** UserControl Node Events */
eventServer.on(events.MAZEGAME.DESTFOUND, (payLoad, cb) => {
  cb(payLoad);
});
