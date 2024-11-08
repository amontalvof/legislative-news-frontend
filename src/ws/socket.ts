import { io } from 'socket.io-client';
import { baseApiUrl } from '../constants/data';

const socket = io(baseApiUrl);

export default socket;
