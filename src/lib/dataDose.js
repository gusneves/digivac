import moment from "moment";

export default function calculoDataDose(vacinas, usuario) {
    console.log(usuario, vacinas);
    const dataBase = moment("01/01/1900", "DD/MM/YYYY");
    usuario.vacinas.map((value, index) => {
        const { doseAtual } = value;
        const { doses } = value;
        if (doseAtual == doses) {
            console.log("todas doses tomadas");
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
