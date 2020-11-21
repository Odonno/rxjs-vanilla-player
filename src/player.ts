import { fromEvent, EMPTY, Observable, merge } from 'rxjs';
import { map, scan, startWith, switchMap } from 'rxjs/operators';

const rootElement = document.getElementById("root");
const startStopButton = document.getElementById("startStopButton");
const clearButton = document.getElementById("clearButton");
const outputElement = document.getElementById("output");

document.body.removeAttribute("style");

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

export const displayObservable = <T>(observable$: Observable<T>, autostart = false) => {
    if (rootElement && startStopButton && outputElement && clearButton) {
        const isPlaying$ = fromEvent(startStopButton, "click").pipe(
            scan(acc => !acc, autostart),
            startWith(autostart),
        );

        const clear$ = fromEvent(clearButton, "click");

        // only one running observable
        const displayRow$ = isPlaying$.pipe(
            switchMap(playing => {
                if (playing) {
                    return observable$;
                }
                return EMPTY;
            })
        );
        
        displayRow$.subscribe(value => {
            displayRow(value);
        });

        // alternate start/stop button
        isPlaying$.subscribe(isPlaying => {
            startStopButton.innerText = isPlaying ? "Stop" : "Start";

            if (!isPlaying) {
                currentIndex = 0;
            }
        });

        // clear
        clear$.subscribe(() => {
            outputElement.innerHTML = "";
        });

        const canClear$ = merge(displayRow$, clear$).pipe(
            map(() => !!outputElement.innerHTML),
            startWith(!!outputElement.innerHTML)
        );

        canClear$.subscribe(canClear => {
            if (canClear) {
                clearButton.removeAttribute("disabled");
            } else {
                clearButton.setAttribute("disabled", "");
            }
        });
    }
};