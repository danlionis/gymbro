// export const BASE_URL = "https://gym.lionis.net/api";
 export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Weekdays {
    data: number[][]
    meta: {
        count: number,
        first: Date,
        last: Date,
    }
}

export async function getWeekdays(): Promise<Weekdays> {
    return fetch(BASE_URL + "/weekdays").then(res => res.json());
}


export async function current() {
    return fetch("https://connect.e-app.eu:57319/easyWeb.svc/eApps/widgets",
        {
            mode: "cors",
            method: "POST",
            body: '{ "call": "GeteLiveauslastung",  "param": {}, "useWS": 0, "studio": "speedfitness-Grafing"}'
        })
        .then(res => res.json())
        .then(res => res["Wert1"] - 2);
}
