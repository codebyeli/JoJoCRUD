import express from 'express'
import { Request, Response } from 'express'
import { json } from 'stream/consumers';

const app = express();

interface Characters{
    id: Number,
    name: String,
    stand: String,
    musicalRef: String,
    age: Number
}

app.use(express.json());

const chars:Characters[] = []

let chars_id = chars.length +1;

app.get('/chars', (req: Request, res: Response) => {
    res.json(chars)
})

app.get('/chars/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const char = chars.find((Character) => Character.id === parseInt(id))
    !char ? res.send("Character was not found") : res.json(char)
})

app.post('/chars', (req: Request, res: Response) => {
    const { name, stand, musicalRef, age } = req.body
    const lookupchar = chars.find((Character) => Character.name.toLowerCase() === name.toLowerCase());
    if(lookupchar){
        return res.status(400).json(
            {
                message: `${name} already exists.`
            }
        )
    }
    const newCharacter = {
        id: chars_id,
        name,
        stand,
        musicalRef,
        age
    };

    chars_id += 1
    chars.push(newCharacter);
    res.status(201).json(newCharacter)
})

app.put('/chars/:id', (req:Request,res:Response) => {
    const { id } = req.params;
    const { name, stand, musicalRef, age } = req.body;
    const index = chars.findIndex((Character) => Character.id === parseInt(id))
    if(index<0){
        return res.status(404).json(`The character with the ID ${id} was not found`);
    }

    const char = chars[index];
    char.stand = stand;
    char.name = name;
    char.age = age;
    char.musicalRef = musicalRef;

    res.status(200).json(char)
})

app.delete('/chars/:id',(req: Request, res: Response) => {
    const { id, stand } = req.params;
    const index = chars.findIndex((Character) => Character.id === parseInt(id))

    if(index < 0) {
        return res.status(404).json(`The character has not been found`)
    }

    const deletedCharacter = chars.splice(index,1)[0];
    res.status(200).json(`${deletedCharacter.stand} has been deleted from the database`)
})

app.listen(3000, () =>{
    console.log('The application is listening on port 3000!')
})