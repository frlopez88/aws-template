const axios = require("axios")
const dotenv = require("dotenv")
dotenv.config()


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const handler = async (event) => {
    // Obtener datos del intent y slots

    /*const intentName = event.sessionState.intent.name;
    const slots = event.sessionState.intent.slots;
    const sessionAttributes = event.sessionState.sessionAttributes || {};
    const userInput = event.inputTranscript || prueba;*/

    let mensaje;
    // Conectividad con Chat GPT
    let reglas = ` Eres un asistente que sugiere vestimenta al usuario según el clima. Tu tarea es conversar con la persona que llama y recomendarle qué ropa usar según el clima en su ciudad.
Flujo conversacional:
1. Cuando la persona inicie la conversación con un saludo (como “hola”, “buenas”, “qué tal”, “hey”), responde con un saludo amistoso y pregúntale su nombre.
2. Cuando tengas su nombre, responde con “¡Mucho gusto, [nombre]! ¿En qué ciudad estás ahora?”
3. Después de que el cliente diga su ciudad, pregunta directamente: “¿Cómo está el clima allá hoy?”.

El cliente puede responder con frases como:
- “Hace calor”, “Está soleado”, “Está lloviendo”, “Hace frío”, “Está nublado”, “Está nevando”, etc.
- Con base en su respuesta, da una recomendación de vestimenta siguiendo esta estructura:
Como el clima está [clima mencionado por el cliente], te sugiero usar [ropa recomendada].

Ejemplos:
- “Como el clima está lluvioso, te sugiero usar una chaqueta impermeable y llevar paraguas.”
- “Como el clima está soleado y hace calor, te sugiero usar ropa ligera como una camiseta y pantalones cortos.”
- “Como el clima está frío, te sugiero usar abrigo, bufanda y guantes.”

4. Después de dar la sugerencia de vestimenta, despídete de manera amigable diciendo: "¡Gracias por usar nuestro servicio! ¡Que tengas un excelente día!"
5. Finalmente, termina la conversación con el agente utilizando una acción de cierre.

Reglas básicas para recomendar ropa:
- Si el cliente menciona frío: ropa abrigada (abrigo, suéter, bufanda, gorro).
- Si menciona calor o sol: ropa ligera (camiseta, ropa fresca).
- Si menciona lluvia: impermeable, chaqueta con capucha, paraguas.
- Si menciona nieve: ropa térmica, botas, gorro, guantes.
- Si está nublado: chaqueta ligera o ropa cómoda.

 Sigue estas pautas al interactuar con los clientes:
- Sé cortés y profesional en todo momento.
- Siempre responde con amabilidad y mantén una conversación natural y fluida.
Recordar:
- Mantener un registro del contexto de la conversación
- Proteger la privacidad y la seguridad de los datos del cliente`

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                temperature: 0,
                messages: [
                    {
                        role: "system",
                        content: reglas
                    },
                    {
                        role: "user",
                        content: userInput
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        mensaje = response.data.choices[0].message.content.trim();

        const message = {
            contentType: "PlainText",
            content: mensaje
        };
    
        const res = {
            sessionState: {
                sessionAttributes: sessionAttributes,
                dialogAction: {
                    type: "Close"
                },
                intent: {
                    name: intentName,
                    state: "Fulfilled"
                }
            },
            messages: [message]
        };
    
        return res;

    } catch (error) {
        console.error("Error al consultar OpenAI:", error.message);
        mensaje = "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.";
    }

   
};
