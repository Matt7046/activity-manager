export const myDisplayer = ((some: string, value: string) => {
    if (document.getElementById(some)) {
        document.getElementById(some)!.innerHTML = value;
    }
})

export interface ResponseI{

testo: any;
status:any;
errors: string[];

} 

export interface UserI {
  _id: string | undefined;
  email: string; 
}
