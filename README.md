This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project properties

### `TLE explenation`
In this section of the project you can get Explenation of every TLE,
Explains the meaning of every feild in the TLE

### `Keplarian convertion`
In this section of the project you can extract from the TLE data,
The data are the Keplarian params -
* A - Semi major axis
* E - eccentricity
* I - Inclination
* Ω - Angle to ascending node	
* ω - Argument of Perigee	
* ν - True anomaly

### `Cartesian convertion`
In this section of the project you can extract from the TLE data,
The data are the Cartesian params -
The Cartesian params Consists of 2 main vectors -    
* the location vector (x,y,x)
* the velocity vector (Vx, Vy, Xz)

### `The SGP4 calculation`
In this section of the project you can make some functionality with SGP4,
SGP4 - Simplified perturbations models
It is a mathematical model used to calculate orbital state vectors of satellites relative to the Earth-centered inertial coordinate system.
In this section you can create a random space point, 
You can genrate a new TLE according the genrated space point
Then from this new TLE you can propegate and predict the new 6 passes of the sattelite by the origin point
This is made by the SGP4 algorithem

### `The Predictor Section`
This is the section of the orbital calculation
1. Insert your TLE to the program
2. Create the initial point or insert it manualy
3. Genrate all 10 measurments by the initial point
4. Make prediction and see the outcome in the run log 



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
