import { useState } from "react";
import "./App.css";

function App() {
  const [date, setDate] = useState("");
  const [beginnWork, setBeginnWork] = useState("");
  const [beginnBreak, setBeginnBreak] = useState("");
  const [endBreak, setEndBreak] = useState("");
  const [endWork, setEndWork] = useState("");
  const [output, setOutput] = useState("");

  const [arbeitszeiten, setarbeitszeiten] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("arbeitszeiten")) || [];
    } catch {
      return [];
    }
  });

  function save() {
    const arbeitsdauer = calculate();

    const zeiten = {
      Datum: date,
      Arbeitsbeginn: beginnWork,
      Pausenstart: beginnBreak,
      Pausenende: endBreak,
      Arbeitsende: endWork,
      Arbeitsdauer: arbeitsdauer,
    };

    setarbeitszeiten((prev) => {
      console.log("Speichere:", arbeitszeiten);
      const neu = [...prev, zeiten];
      console.log("Neues Array:", neu);
      localStorage.setItem("arbeitszeiten", JSON.stringify(neu));
      console.log(localStorage.getItem("arbeitszeiten"));
      return neu;
    });

    // Felder leeren
    setDate("");
    setBeginnWork("");
    setBeginnBreak("");
    setEndBreak("");
    setEndWork("");
    setOutput("");
  }

  function calculate() {
    if (!date || !beginnWork || !endWork) {
      setOutput("Bitte Datum, Arbeitsbeginn und Arbeitsende eingeben");
      return;
    }

    setOutput("Berechnung erfolgreich");

    // kleine Hilfsfunktion: HH:00 -> Date
    function toDate(time) {
      if (typeof time !== "string") {
        // console.error("Invalid time format:", time);
        return null;
      }
      const [hours, minutes] = time.split(":");
      return new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
    }

    const startDate = toDate(beginnWork);
    const endeDate = toDate(endWork);

    // Grunddauer in Minuten
    let minuten = (endeDate - startDate) / 60000;
    if (minuten < 0) minuten += 24 * 60; // falls über Mitternacht

    // Pause abziehen (falls vorhanden)
    if (beginnBreak && endBreak) {
      const pauseS = toDate(beginnBreak);
      const pauseE = toDate(endBreak);
      let pauseMin = (pauseE - pauseS) / 60000;
      if (pauseMin < 0) pauseMin += 24 * 60; // theoretisch, falls Pause über Mitternacht
      minuten -= pauseMin;
    }

    if (minuten < 0) minuten = 0; // Sicherheit

    const stunden = Math.floor(minuten / 60);
    const restMinuten = Math.round(minuten % 60);

    setOutput(`gearbeitete Stunden: ${stunden}h ${restMinuten}min`);

    return `${stunden}h ${restMinuten}min`;
  }

  function printArbeitszeiten() {
    window.print();
  }

  return (
    <>
      <h2>Arbeitszeiterfassung</h2>
      <label htmlFor="date">Datum: </label>
      <input
        type="date"
        id="date"
        name="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <label htmlFor="beginnWork">Arbeitsbeginn:</label>
      <input
        type="time"
        id="beginnWork"
        value={beginnWork}
        onChange={(e) => setBeginnWork(e.target.value)}
      />
      <br />
      <label htmlFor="beginnBreak">Beginn Mittagspause:</label>
      <input
        type="time"
        id="beginnBreak"
        value={beginnBreak}
        onChange={(e) => setBeginnBreak(e.target.value)}
      />
      <br />
      <label htmlFor="endBreak">Ende Mittagspause:</label>
      <input
        type="time"
        id="endBreak"
        value={endBreak}
        onChange={(e) => setEndBreak(e.target.value)}
      />
      <label htmlFor="endWork">Arbeitsende:</label>
      <input
        type="time"
        id="endWork"
        value={endWork}
        onChange={(e) => setEndWork(e.target.value)}
      />{" "}
      <br />
      <button onClick={calculate}>Berechnen</button> <br />
      <p> {output}</p>
      <br />
      <button onClick={save}>Speichern</button>
      <br />
      <h3>Gespeicherte Arbeitszeiten</h3>
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Arbeitsbeginn</th>
            <th>Pausenstart</th>
            <th>Pausenende</th>
            <th>Arbeitsende</th>
            <th>Arbeitsdauer</th>
          </tr>
        </thead>

        <tbody>
          {arbeitszeiten.map((eintrag, index) => (
            <tr key={index}>
              <td>{eintrag.Datum}</td>
              <td>{eintrag.Arbeitsbeginn}</td>
              <td>{eintrag.Pausenstart}</td>
              <td>{eintrag.Pausenende}</td>
              <td>{eintrag.Arbeitsende}</td>
              <td>{eintrag.Arbeitsdauer}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <button onClick={printArbeitszeiten}>Drucken</button>
    </>
  );
}

export default App;
