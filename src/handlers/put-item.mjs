// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const id = body.id; //math random
    const marca = body.marca;
    const modelo = body.modelo;
    const color = body.color;
    const tipo = body.tipo;
    const año = body.año; // parsearlo porque lo reconoce como string
    const distintivo = body.distintivo;

    console.log ('DEBUG', body);

    // creamos una funcion para determinar el tipo de distintivo ambiental
    let tipoCombustible;
    switch (distintivo){
        case "B":
            tipoCombustible="Diésel";
            break;
        case "C":
            tipoCombustible="Gasolina";
            break;
        case "Eco":
            tipoCombustible="Híbrido";
            break;
        case "0":
            tipoCombustible="Electrico";
            break;
        default:
            tipoCombustible="Desconocido";
    }

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    if (año < 1940) {
        return {
            statusCode: 403,
            body: "El año introducido es demasiado antiguo, no hay registros"
        }

    }else{


    
    
    
    var params = {
        TableName : tableName,
        Item: { id : id, marca : marca, modelo : modelo, color : color, tipo : tipo, año : año, distintivo : distintivo, tipoCombustible : tipoCombustible }
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
      } catch (err) {
        console.log("Error", err.stack);
      }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
        console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
        return response;
    }
};
