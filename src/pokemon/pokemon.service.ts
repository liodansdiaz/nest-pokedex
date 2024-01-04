import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';


@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}


  async create(createPokemonDto: CreatePokemonDto) {
    
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    }
    catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return  await this.pokemonModel.find();
  }

  async findOne(term: string) {

    let pokemon: Pokemon;
    //por el no.
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne( {no: term} );
    }
    //por el mongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    //name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim() });
    }
    if(!pokemon)
    {
      throw new NotFoundException(`Pokemon with id, name o no "${term}" not found`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {    
        await pokemon.updateOne( updatePokemonDto, {new:true});        
        return  {...pokemon.toJSON(), ...updatePokemonDto};      
    }
    catch (error) {
        this.handleExceptions(error);
    }

    
  }

  async remove(id: string) {
    
    // const pokemon = await this.findOne(id); 
    // await pokemon.deleteOne();

    //const result = await this.pokemonModel.findByIdAndDelete(id);
    const {  deletedCount} = await this.pokemonModel.deleteOne({_id: id});

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found.`);
    }
    return deletedCount;
  }


  private handleExceptions(error: any) {
    if( error.code == 11000)
    {
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon. CHeck server logs`);  
  }
}
