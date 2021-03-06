import moment from "moment";

export function calculoDataDose(vacinas, usuario) {
    const dataBase = moment("01/01/1900", "DD/MM/YYYY");
    usuario.vacinas.map((value, index) => {
        const { doseAtual } = value;
        const { doses } = value;
        if (doseAtual == doses) {
            let newUserData = { ...usuario.vacinas[index], dataDose: null };
            usuario.vacinas[index] = newUserData;
        } else {
            const idade_dose = moment(
                vacinas[index].idade_doses[doseAtual],
                "DD/MM/YYYY"
            );
            const diferencaDatas = idade_dose.diff(dataBase);
            console.log(diferencaDatas);
            const dataDose = moment(usuario.data_nasc).add(
                diferencaDatas,
                "ms"
            );
            let newUserData = { ...usuario.vacinas[index], dataDose };
            newUserData.dataDose = moment(newUserData.dataDose).toDate();
            usuario.vacinas[index] = newUserData;
        }
    });
    return usuario;
}

export function novaDose(_idVacina, idade_doses, usuario, doses) {
    let dataFinal;

    const dataBase = moment("01/01/1900", "DD/MM/YYYY");
    usuario.vacinas.map((value, index) => {
        if (value._id === _idVacina) {
            value.doseAtual++;
            if (value.doseAtual === doses) {
                value.dataDose = null;
                dataFinal = value.dataDose;
            } else {
                const idade_dose = moment(
                    idade_doses[value.doseAtual],
                    "DD/MM/YYYY"
                );
                const diferencaDatas = idade_dose.diff(dataBase);
                const newDataDose = moment(usuario.data_nasc).add(
                    diferencaDatas,
                    "ms"
                );
                value.dataDose = moment(newDataDose).toDate();
                dataFinal = value.dataDose;
            }
        }
    });

    return dataFinal;
}

export function novaDataNasc(vacinas, usuario) {
    const dataBase = moment("01/01/1900", "DD/MM/YYYY");
    console.log(usuario.data_nasc);
    const {data_nasc} = usuario;

    usuario.vacinas.map((value, index) => {
        const { doseAtual } = value;
        const { doses } = value;
        if (doseAtual != doses) {
            const idade_dose = moment(
                vacinas[index].idade_doses[doseAtual],
                "DD/MM/YYYY"
            );
            const diferencaDatas = idade_dose.diff(dataBase);
            const dataDose = moment(data_nasc).add(diferencaDatas, "ms");
            usuario.vacinas[index].dataDose = dataDose;
            usuario.vacinas[index].dataDose = moment(
                usuario.vacinas[index].dataDose
            ).toDate();
        }
    });
    return usuario;
}
