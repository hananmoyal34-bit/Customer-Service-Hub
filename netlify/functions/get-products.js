// This function is no longer used as product data is not fetched from a datasheet anymore.
export default async (req, context) => {
    return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' }
    });
};
