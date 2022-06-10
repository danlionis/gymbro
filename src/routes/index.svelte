<script lang="ts">
    import { getWeekdays, current } from "../lib/api";
    import type { Weekdays } from "../lib/api";

    let count = 0;
    let currentPercent: number;
    let first: String;
    let last: String;
    let data: Weekdays;
    let abweichung: number;

    const daynames = [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
        "Sonntag",
    ].reverse();
    const xs = [...Array(1440).keys()].map(
        (i) =>
            `${Math.floor(i / 60)
                .toString()
                .padStart(2, "0")}:${(i % 60).toString().padStart(2, "0")}`
    );

    $: if (data !== undefined) {
        first = new Date(data.meta.first).toLocaleString("de-DE", {
            timeZone: "UTC",
        });
        last = new Date(data.meta.last).toLocaleString("de-DE", {
            timeZone: "UTC",
        });

        count = data.meta.count;

        const heatmap = [
            {
                z: data.data.reverse(),
                y: daynames,
                x: xs,
                // x0: 5,
                // dx: 1 / 60,
                type: "heatmap",
            },
        ];

        Plotly.newPlot("heatmap", heatmap, {
            title: `Auslastung nach Wochentag und Zeit (Durchschnitt)`,
        });

        const lines = [];
        for (let i = 0; i < data.data.length; i++) {
            const ys = data.data[i];
            const day = daynames[i];
            lines.push({
                x: xs,
                y: ys,
                name: day,
                line: { shape: "spline" },
            });
        }

        Plotly.newPlot("week_line", lines.reverse(), {
            title: "Auslastung nach Wochentag und Zeit (Durchschnitt)",
        });

        const date = new Date();
        let weekday = date.getDay() - 1;
        weekday = ((weekday % 7) + 7) % 7;

        const minute = date.getHours() * 60 + date.getMinutes();
        /* console.log({ weekday, minute }); */

        const a = data.data.reverse()[weekday][minute];
        const o = currentPercent;
        abweichung = o - a;
    }

    $: mehrWeniger = !abweichung
        ? ""
        : `(${Math.abs(abweichung)}% ${
              abweichung >= 0 ? "mehr" : "weniger"
          } als gewöhnlich)`;

    // fetch the historical data
    getWeekdays().then((res) => (data = res));

    // fetch the current data
    current().then((res) => (currentPercent = res));
</script>

<h1>Auslastungsverlauf</h1>

<a href="/about">about</a>
{#if currentPercent !== undefined}
    <h2>Aktuell: {currentPercent}%</h2>
    <h3>{mehrWeniger}</h3>
{:else}
    <h2>Aktuelle Auslastung wird ermittelt...</h2>
{/if}

{#if !data}
    <h3>Diagramme werden geladen...</h3>
{/if}
<div id="heatmap" />
<div id="week_line" />
