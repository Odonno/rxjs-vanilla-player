import { fromEvent, EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const rootElement = document.getElementById("root");
const startStopButton = document.getElementById("startStopButton");
const outputElement = document.getElementById("output");

let currentIndex = 0;

const displayRow = (value: any) => {
    const date = new Date().toLocaleString();

    const output = typeof value === "object" ? JSON.stringify(value, null, 2) : value;

    if (outputElement) {
        const child = `
<div class="row">
    <div><i>#${currentIndex++}, ${date}</i></div>
    <div>${output}</div>
</div>
        `;

        outputElement.insertAdjacentHTML("afterbegin", child);
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