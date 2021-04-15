let User = require('../repository/User');
let bcrypt = require('bcryptjs');

module.exports = class Login {
    printLogin(req, res) {
        res.render('login', { title: 'TeLoger' });
    }

    async processLogin(req, res) {
        //On récupère les infos du form post 

        let userLogin = {
            email: req.body.email
            , pass: req.body.pass
        };

        console.log(userLogin);

        // vérifier si l'email et le mot de passe sont bien présent en bdd 

        const verifMail = await (new User()).findMail(userLogin.email);

        //si le mail tapé est résent en base alors je controle si le mdp est correct 
        if (verifMail !== null) {

            // on décrypte le mdp pui on le compare avec le mdp saisie par l'utilisateur 
            let verifPwd = bcrypt.compareSync(userLogin.pass, verifMail.pass)

            // Si le mail et le mdp est correct on redirige vers la page d'accueil
            if (verifPwd) {
                req.flash('notify', 'Vous êtes connecté !');
                res.redirect('/');
            } else {

                req.flash('error', 'Le mot de passe est incorrect');
                res.redirect('/login');
            }

        }
        // Si l'email est incorrect on affiche un msg d'erreur 
        else {

            req.flash('error', "L'email n'existe pas en base.");
            res.redirect('/login');
        }

    }
};