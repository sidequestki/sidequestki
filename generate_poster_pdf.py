import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
)

def create_poster(filename="SIDEQUESTKI_Printable_Campus_Poster.pdf"):
    # A4: 595.27 x 841.89 pt
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    width = 595.27 - 72 # 523 pt
    styles = getSampleStyleSheet()
    
    story = []

    # Header Badge
    badge_style = ParagraphStyle(
        'TopBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#2563EB"),
        alignment=1
    )
    
    title_style = ParagraphStyle(
        'PosterTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=33,
        textColor=colors.HexColor("#0F172A"),
        alignment=1,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'PosterSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#475569"),
        alignment=1,
        spaceAfter=14
    )

    story.append(Paragraph("⚔️ <b>INDEPENDENT CAMPUS DISCOVERY HUB</b> ⚔️", badge_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("WHAT'S YOUR<br/>SIDEQUEST THIS WEEK?", title_style))
    story.append(Paragraph("Stop searching through messy WhatsApp chats. Discover all campus workshops, club tournaments, talks &amp; free makan in one single timetable.", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#CBD5E1"), spaceAfter=14))

    # Center QR Code Block
    qr_img = Image("sidequestki_qr.png", width=180, height=180)
    
    qr_caption = Paragraph(
        "<b>SCAN TO OPEN THIS WEEK'S TIMETABLE</b><br/>"
        "<font size=9 color='#64748B'>No app download needed • Instant 1-tap mobile access</font>",
        ParagraphStyle('QRCap', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=15, alignment=1, textColor=colors.HexColor("#1E293B"))
    )

    qr_box_data = [
        [qr_img],
        [Spacer(1, 4)],
        [qr_caption]
    ]
    
    qr_table = Table(qr_box_data, colWidths=[width])
    qr_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#3B82F6")),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(qr_table)
    story.append(Spacer(1, 16))

    # 3 Value Highlight Columns
    col_style = ParagraphStyle(
        'ColText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
        alignment=1
    )
    col_title = ParagraphStyle(
        'ColTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#0F172A"),
        alignment=1,
        spaceAfter=3
    )

    val_data = [
        [
            Paragraph("🍔<br/><b>FREE MAKAN &amp; LOOT</b>", col_title),
            Paragraph("🎖️<br/><b>MERITS &amp; E-CERTS</b>", col_title),
            Paragraph("📅<br/><b>1-TAP CALENDAR SYNC</b>", col_title),
        ],
        [
            Paragraph("Filter out events offering free meals, packed lunches, or merch.", col_style),
            Paragraph("Find verified workshops that award college merits and certificates.", col_style),
            Paragraph("Sync directly to Google/Apple Calendar with a 1-hour auto reminder.", col_style),
        ]
    ]

    col_w = width / 3.0
    val_table = Table(val_data, colWidths=[col_w, col_w, col_w])
    val_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(val_table)
    story.append(Spacer(1, 16))

    # Organizer Callout Box
    org_title = ParagraphStyle('OrgTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=colors.HexColor("#1E1B4B"), alignment=1)
    org_body = ParagraphStyle('OrgBody', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12.5, textColor=colors.HexColor("#312E81"), alignment=1)

    org_box_data = [
        [Paragraph("📢 <b>ATTENTION CLUB ORGANIZERS &amp; SOCIETIES</b>", org_title)],
        [Paragraph("Hosting a workshop, tournament, festival, or talk next week?<br/>"
                   "Submit your event details for free before <b>Friday at 11:59 PM</b> to be featured in our official <b>Monday Blast</b>!<br/>"
                   "<font size=8 color='#4338CA'><b>Scan the QR code above and tap 'Submit a Sidequest'</b></font>", org_body)]
    ]
    org_table = Table(org_box_data, colWidths=[width])
    org_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EEF2FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#6366F1")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(org_table)
    story.append(Spacer(1, 10))

    # Footer note
    footer_style = ParagraphStyle(
        'FootNote',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#94A3B8"),
        alignment=1
    )
    story.append(Paragraph("<b>SIDEQUESTKI</b> • Independent Student Event Directory • Updated Every Monday Morning", footer_style))

    doc.build(story)
    print(f"Printable Poster generated: {filename}")

if __name__ == "__main__":
    create_poster()
