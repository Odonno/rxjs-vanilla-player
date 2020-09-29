import './styles.css';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

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

if (rootElement && startStopButton && outputElement) {
    // TODO : alternate start/stop button
    // TODO : only one running observable
    startStopButton.addEventListener("click", () => {
        timer(0, 1000).pipe(
            map(i => i ** 2)
        ).subscribe(index => {
            displayRow(index);
        });
    });
}