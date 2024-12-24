export const myDisplayer = ((some: any, value: any) => {
    document.getElementById(some)!.innerHTML = value;
})