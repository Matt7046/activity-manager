export const myDisplayer = ((some: any, value: any) => {
    if (document.getElementById(some)) {
        document.getElementById(some)!.innerHTML = value;
    }
})