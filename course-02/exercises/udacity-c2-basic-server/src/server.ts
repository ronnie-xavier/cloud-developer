import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars = cars_list;

  //Create an express applicaiton
  const app = express();
  //default port to listen
  const port = 8082;

  //use middleware so post bodies
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json());

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name",
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as
  // an application/json body to {{host}}/persons
  app.post( "/persons", ( req: Request, res: Response ) => {
      const { name, temp } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}! and a warm hello to dd${temp}`);
  } );

  //An endpoint to GET a list of cars
  // it is  filterable by make with a query paramater: http://localhost:8082/cars/?make=honda
  app.get("/cars", (req: Request, res: Response) => {
      const { make } = req.query;

      if (!make) {
          return res.status(200).send(cars);
      } else {
          const cars_of_specific_make = cars.filter(car => car.make === make);
          console.log(`make requested is ${make}`)
          return res.status(200).send(cars_of_specific_make);
      }
  } );

  // An endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/cars/:id", (req: Request, res: Response) => {
      let { id } = req.params;
      console.log(`id from client is ${id}`);

      id = Number(id);
      console.log(`id requested is ${id}`);

      if (id === undefined || isNaN(id)) {
          return res.status(400).send(`id is mandatory`);
      }

      for (const car of cars) {
          if (car.id === id) {
              return res.status(200).send(car);
          }
      }
      return res.status(404).send(`car with id ${id} not found`);
  });

  /// An endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post("/cars", (req: Request, res: Response) => {
      const car = req.body;
      const { id, type, model, cost, make } = car;

      if(id === undefined || isNaN(id) || !type || !model || !cost || !make) {
          return res.status(400).send(`please ensure id type make model and cost are present`)
      }
      car.id = Number(car.id);
      car.cost = Number(car.cost);

      cars.push(car);

      return res.status(200).send(cars);
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
