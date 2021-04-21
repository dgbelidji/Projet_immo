let Realty = require('../repository/Biens')
let UploadImageRealtyService = require('../services/UploadImageRealty')

module.exports = class Biens {
    print(req, res) {
        res.render('admin/biens', {
            title: 'TeLoger'
        });
    }

    processForm(req, res) {
        // console.log('req.body');
        // console.log(req.body);

        let realtyAdress = {
            sellerName: req.body.seller
            , adress: req.body.adress
            , postalCode: req.body.postalCode
            , city: req.body.city
            , surface: req.body.surface
            , room: req.body.room
            , infosAdress: req.body.infosAdress
        };
        let contact = {
            nom: req.body.contactName
            , prenom: req.body.contactFirstName
            , email: req.body.mail
            , phone: req.body.phoneNumber
            , infosContact: req.body.infosContact
        };


        let repo = new Realty();

        // gestion du chargement des images : 




        repo.add({ realtyAdress, contact }).then((idRealty) => {
            // Enregistrement des images
            let photos = [];

            //Si mon obj req.files n'est pas vide (alors j'ai bien des fichiers d'upload)
            if (typeof req.files != 'undefined' && req.files != null) {

                const UploadImageRealty = new UploadImageRealtyService();

                // Si je ne charge qu'une photo
                if (typeof req.files.photos[0] === 'undefined') {
                    //je stocke mon image dans un tableau
                    let img = req.files.photos;
                    req.files.photos = new Array();
                    req.files.photos.push(img);
                }
                //Si mon tableau contient des données
                if (typeof req.files.photos != 'undefined' && req.files.photos.length > 0) {
                    // console.log(typeof (req.files.photos));
                    // console.log('req.files.photos :');
                    // console.log(req.files.photos);

                    //Je rajoute ma promesse de déplacement des photos upload
                    Object.values(req.files.photos).forEach(file => {
                        photos.push(UploadImageRealty.moveFile(file, idRealty));
                    });
                }
            }
            // console.log(photos)
            //J'exécute mes déplacement de photo
            Promise.all(photos)
        }).then(() => {
            req.flash('notify', 'Le bien a été ajouté à la base');
            res.redirect('/admin/realtyList');
        });


    }
};