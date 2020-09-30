import './styles.css';
import { playObservable } from './player';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

// TODO : write your own Observable here
const observable = timer(0, 1000).pipe(
    map(i => [i, i** 2])
);

playObservable(observable);