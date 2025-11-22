import sys
from google import genai

# API Key
api_key = "LOL?"

def get_lyrics(title, artist):
    try:
        # Inisialisasi client
        client = genai.Client(api_key=api_key)
        
        # Buat prompt
        prompt = f"Carikan saya Lyric pada Musixmatch dengan format LRC dari lagu {title} by {artist}. Format LRC harus mencakup timestamp dalam format [mm:ss.xx] untuk setiap baris lirik pada lagu tersebut pastikan lyric dan lagu sesuai."
        
        # Generate content
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        # Ekstrak hanya konten LRC dari response
        result_text = response.text
        
        # Cari konten antara ```lrc dan ```
        if "```lrc" in result_text:
            # Split berdasarkan ```lrc
            parts = result_text.split("```lrc")
            if len(parts) > 1:
                # Ambil bagian setelah ```lrc dan sebelum ```
                lrc_content = parts[1].split("```")[0].strip()
                print(lrc_content)
            else:
                print(result_text)
        else:
            # Jika tidak ada marker ```lrc, print semua
            print(result_text)
        
    except Exception as e:
        # Print error ke stderr
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python gemini.py <title> <artist>", file=sys.stderr)
        sys.exit(1)
    
    title = sys.argv[1]
    artist = sys.argv[2]
    
    get_lyrics(title, artist)