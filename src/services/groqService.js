import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function generateScript(params) {
    const { title, prompt, genre, timePeriod, dialogueStyle, contentType, length } = params;

    const systemPrompt = `You are a professional screenwriter. Generate a compelling script based on the following parameters:
- Title: ${title}
- Genre: ${genre}
- Time Period: ${timePeriod}
- Dialogue Style: ${dialogueStyle}
- Content Type: ${contentType}
- Estimated Duration: ${length} minutes (Ensure the script length corresponds to this duration, typically ~1 page per minute)

Format the script with proper scene headings (INT./EXT.), action lines, and character dialogue.`;

    const completion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        max_tokens: 4096
    });

    return completion.choices[0]?.message?.content || '';
}

export async function editScript(script, editPrompt) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'You are a professional script editor. Edit the following script based on the user\'s instructions while maintaining proper screenplay format.'
            },
            {
                role: 'user',
                content: `Original Script:\n${script}\n\nEdit Instructions: ${editPrompt}`
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096
    });

    return completion.choices[0]?.message?.content || '';
}

export async function generateCharacters(script) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `Analyze the script and extract main characters. Return a JSON array with objects containing:
1. "name": The character's name.
2. "description": A brief physical description.
3. "traits": A list of key character traits.
4. "arc": A brief summary of the character's emotional or narrative journey.
5. "colorPalette": An array of 3-4 hex color codes that visually represent the character's vibe or aesthetic.

Only return the JSON array, no other text.`
            },
            { role: 'user', content: script }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 2048
    });

    try {
        const content = completion.choices[0]?.message?.content || '[]';
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
        return [];
    }
}

export async function generateAmbience(script) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'Analyze the script and suggest sound design/ambience. Return a JSON array with objects containing "title" and "description" fields for each sound element. Only return the JSON array, no other text.'
            },
            { role: 'user', content: script }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 1024
    });

    try {
        const content = completion.choices[0]?.message?.content || '[]';
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
        return [];
    }
}

export async function generateProjectReport(script) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `Analyze the script and generate a production report in JSON format.
Include:
1. "tasks": An array of strings representing production tasks (e.g., "Finalize script", "Location scouting").
2. "budget": A single number (integer) representing an estimated production budget in USD.
Only return the JSON object.`
            },
            { role: 'user', content: script }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 1024
    });

    try {
        const content = completion.choices[0]?.message?.content || '{}';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { tasks: [], budget: 0 };
    } catch {
        return { tasks: [], budget: 0 };
    }
}
