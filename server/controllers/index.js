// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

let lastAdded = new Cat(defaultData);

const hostIndex = (req, res) => {
  res.render('index', {
    title: 'Home',
    pageName: 'Home Page',
    currentName: lastAdded.name,
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback);
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback);
};

const readCat = (req, res) => {
  const name1 = req.query.name;
  const callback = (err, doc) => {
    if (err) {
      return res.json({ err });
    }
    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};

const readDog = (req, res) => {
  const name1 = req.query.name;
  const callback = (err, doc) => {
    if (err) {
      return res.json({ err });
    }
    return res.json(doc);
  };

  Dog.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err });
    }
    return res.render('page1', {
      title: 'page1',
      pageName: 'Page1',
      cats: docs,
    });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2', {
    title: 'Page2',
  });
};

const hostPage3 = (req, res) => {
  res.render('page3', {
    title: 'Page3',
  });
};

const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err });
    }
    return res.render('page4', {
      title: 'page4',
      pageName: 'Page4',
      dogs: docs,
    });
  };

  readAllDogs(req, res, callback);
};

const getName = (req, res) => {
  res.json({ name: lastAdded.name });
};

const setCatName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;
  const catData = {
    name,
    bedsOwned: readAllCats.body.beds,
  };

  const newCat = new Cat(catData);

  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAdded = newCat;

    res.json({
      name: lastAdded.name,
      beds: lastAdded.bedsOwned,
    });
  });

  savePromise.catch((err) => {
    res.json({ err });
  });

  return res;
};

const setDogName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'firstname, lastname, breed, and age are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;
  const dogData = {
    name,
    breed: readAllDogs.body.breed,
    age: readAllDogs.body.age,
  };

  const newDog = new Dog(dogData);

  const savePromise = newDog.save();

  savePromise.then(() => {
    lastAdded = newDog;

    res.json({
      name: lastAdded.name,
      breed: lastAdded.breed,
      age: lastAdded.age,
    });
  });

  savePromise.catch((err) => {
    res.json({ err });
  });

  return res;
};

const searchCatName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err });
    }

    if (!doc) {
      return res.json({ error: 'No Cats found' });
    }

    return res.json({
      name: doc.name,
      beds: doc.bedsOwned,
    });
  });
};

const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Dog.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err });
    }

    if (!doc) {
      return res.json({ error: 'No Dogs found' });
    }

    const newDog = new Dog({
      name: doc.name,
      breed: doc.breed,
      age: doc.age,
    });

    newDog.age++;

    const savePromise = newDog.save();

    savePromise.then(() => {
      lastAdded = newDog;

      res.json({
        name: lastAdded.name,
        breed: lastAdded.breed,
        age: lastAdded.age,
      });
    });

    savePromise.catch(() => {
      res.json({ err });
    });

    return res;
  });
};

const updateLastCat = (req, res) => {
  lastAdded.bedsOwned++;

  const savePromise = lastAdded.save();

  savePromise.then(() => {
    res.json({
      name: lastAdded.name,
      beds: lastAdded.bedsOwned,
    });
  });

  savePromise.catch((err) => {
    res.json({ err });
  });
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    title: 'Page Not Found',
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  readDog,
  getName,
  setCatName,
  setDogName,
  updateLastCat,
  searchCatName,
  searchDogName,
  notFound,
};
