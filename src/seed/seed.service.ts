import { Injectable } from '@nestjs/common';
import axios,{ AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { url } from 'inspector';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  private readonly axios: AxiosInstance = axios;

 async executeSeed(){
 
  await this.pokemonModel.deleteMany({}); //borra toda la Db como en SQL delete * from Pokemon(esto lo hago pq mongo de error si hay entidades repetidas)

  //  //1ra variante (es lenta pq inserta uno a uo cada entidad en mi Db)
  // const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=200');

  // data.results.forEach(async ({name, url}) => {

  //   const segments = url.split('/');
  //   const no: number = +segments[segments.length-2];
    
  //   let pokemonCreated = await this.pokemonModel.create({no, name});
  //   //console.log(pokemonCreated);
    
  // })
  // //---------------------------------------------------------------------------------------------
  //   //2da variante (mas rapida ya que inserta de una sola vez)
  //   //creando un arreglo de promesas y luego los inserta
  //   const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=200');

  //   const insertPromisesArray = [];

  //   data.results.forEach( ({name, url}) => {
  
  //     const segments = url.split('/');
  //     const no: number = +segments[segments.length-2];
      
  //     insertPromisesArray.push(this.pokemonModel.create({no, name}));
  // });
  // await Promise.all(insertPromisesArray); //inserta en la Db el arreglo de promesas que llene de una sola iteracion


  //---------------------------------------------------------------------------------------------
    //3ra variante (rapida tambien, crea un arreglo de pokemon y luego lo inserta con el metodo InsertMany)
    //es mas legible y sencilla
    const data  = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=200');

    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach( ({name, url}) => {
  
      const segments = url.split('/');
      const no: number = +segments[segments.length-2];
      
      pokemonToInsert.push({no, name}); //agrego a areglo cada uno de los pokemon
  });
  await this.pokemonModel.insertMany(pokemonToInsert);
  return 'Seed executed';
 }
}
