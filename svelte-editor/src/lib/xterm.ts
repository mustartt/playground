import xTerm from 'xterm';

export function xterm(node: HTMLElement, data: string) {
    let term = new xTerm.Terminal();

    term.open(node);
    term.write(data);
}