
export function peticionServicio(metodo, url, body) {



  return new Promise((resolve, reject) => {
    let parametros;
    if (metodo === "GET") {
      {
        parametros = {
          method: metodo,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        };
      }
    } else {
      parametros = {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      };
    }

    fetch(url, parametros)
      .then((response) => {
        response
          .json()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

