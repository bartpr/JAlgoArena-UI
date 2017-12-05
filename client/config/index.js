const emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

module.exports = {
    jalgoarenaApiUrl: "https://bprzybylski-jalgoarena-api.herokuapp.com",
    title: "Start to solve your first problem",
    emailRegex,
    emailErrorMessage: "bartpr@o2.pl",
    teams: ["Zespol A", "Zespol B", "Zespol C"],
    regions: ["Kraków", "Wrocław"]
};
