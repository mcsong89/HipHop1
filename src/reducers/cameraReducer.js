import { createAction, handleActions } from 'redux-actions';

const initialState = {
    state: {
        permissionsGranted: false,
        type: 'front',
        flash: 'off',
        readyRecord: false,
        startRecord: false,
        whiteBalance: 'auto',
        ratio: '16:9',
        autoFocus: 'on',
        depth: 0,
        videos: [],
        faces: [],
        photoId: 1,
        recordingId: 1,
    },
};

