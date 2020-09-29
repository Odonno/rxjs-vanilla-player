import { fromEvent, EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const rootElement = document.getElementById("root");
const startStopButton = document.getElementById("startStopButton");
const outputElement = document.getElementById("output");

let currentIndex = 0;

const displayRow = (value: any) => {
    const date = new Date().toLocaleString();

    if (outputElement) {
        outputElement.innerHTML = `<div>#${currentIndex++}, Value: ${value}, Date: ${date}</div>` + outputElement.innerHTML;
    }
}

export const playObservable = <T>(observable: Observable<T>) => {
    if (rootElement && startStopButton && outputElement) {
        const playing$ = fromEvent(startStopButton, "click").pipe(
            map((_, index) => index % 2 === 0)
        );
    
        // only one running observable
        playing$.pipe(
            switchMap(playing => {
                if (playing) {
                    return observable;
                }
                return EMPTY;
            })
        ).subscribe(value => {
            displayRow(value);
        });
    
        // alternate start/stop button
        playing$.subscribe(playing => {
            startStopButton.innerText = playing ? "Stop" : "Start";

            if (!playing) {
                currentIndex = 0;
                outputElement.innerHTML = "";
            }
        });
    }
};