import { ActivityState } from "./Activity";



export const myDisplayer = ((some: any, value: any) => {
    document.getElementById(some)!.innerHTML = value;
})

const functionTestActivity = (state: ActivityState) => {
    return new Promise<string>((resolve, reject) => {
        try {
            resolve('ok');
        } catch (error) {
            reject(error); // Gestisci eventuali errori
        }
    });
};



export const ascoltatore = (valueStore: any, p0: string) => {
    return functionTestActivity(valueStore)
        .then((value: any) => {
            console.log("Il valore dello store è ", valueStore)
            myDisplayer(p0, valueStore);
        },
        )


}
