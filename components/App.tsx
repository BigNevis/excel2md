import React, { useState } from "react";
import PantallaInicio from "../components/PantallaInicio";
import CargaArchivos from "../components/carga-archivos";
import PaginaEnConstruccion from "../components/PaginaEnConstruccion";
import PaginaAnalisisIA from "../components/pagina-analisis-ia";

export default function App() {
  const [pantallaActual, setPantallaActual] = useState<"inicio" | "carga" | "construccion" | "analisis">("inicio");

  const navegarAPantalla = (pantalla: "inicio" | "carga" | "construccion" | "analisis") => {
    setPantallaActual(pantalla);
  };

  return (
    <>
      {pantallaActual === "inicio" && (
        <PantallaInicio
          onTransformarClick={() => navegarAPantalla("carga")}
          onAnalizarClick={() => navegarAPantalla("analisis")}
        />
      )}
      {pantallaActual === "carga" && (
        <CargaArchivos
          onVolverInicio={() => navegarAPantalla("inicio")}
          onSiguiente={() => navegarAPantalla("construccion")}
        />
      )}
      {pantallaActual === "construccion" && (
        <PaginaEnConstruccion
          onVolverInicio={() => navegarAPantalla("inicio")}
        />
      )}
      {pantallaActual === "analisis" && (
        <PaginaAnalisisIA
          onVolver={() => navegarAPantalla("inicio")}
          onSiguiente={() => navegarAPantalla("construccion")}
        />
      )}
    </>
  );
}