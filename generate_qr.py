import qrcode
from PIL import Image

def generate_qr():
    # Production URL for Sidequestki (or customizable link)
    target_url = "https://sidequestki.github.io"
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=12,
        border=2,
    )
    qr.add_data(target_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF").convert('RGB')
    img.save("sidequestki_qr.png")
    print("Successfully generated high-res QR code: sidequestki_qr.png")

if __name__ == "__main__":
    generate_qr()
