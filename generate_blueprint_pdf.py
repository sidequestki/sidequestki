import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 810, "SIDEQUESTKI")
            self.setFont("Helvetica", 8)
            self.drawString(105, 810, "— Master Project Blueprint & Operations Manual")
            self.drawRightString(555, 810, "Independent 3rd-Party Hub")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(40, 804, 555, 804)
        
        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(40, 38, 555, 38)
        
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(40, 26, "CONFIDENTIAL & PROPRIETARY • INDEPENDENT STUDENT EVENT AGGREGATOR")
        self.setFont("Helvetica-Bold", 7.5)
        self.drawRightString(555, 26, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def create_pdf(filename="SIDEQUESTKI_Project_Master_Blueprint.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=46,
        bottomMargin=48
    )
    
    content_width = 515
    styles = getSampleStyleSheet()
    
    # Custom Typography
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#0F172A")
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14.5,
        textColor=colors.HexColor("#475569")
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
        spaceAfter=5
    )
    
    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#1E293B")
    )
    
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.5,
        textColor=colors.HexColor("#1E293B")
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor("#0F172A")
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )

    story = []

    # =========================================================
    # PAGE 1: STRATEGY, PROBLEM & NEUTRALITY MODEL
    # =========================================================
    banner_data = [
        [
            Paragraph("<b>PROJECT MASTER BLUEPRINT &amp; OPERATIONAL SPECIFICATION</b>", 
                      ParagraphStyle('BHeader', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#2563EB"))),
        ],
        [
            Paragraph("SIDEQUESTKI", title_style)
        ],
        [
            Paragraph("<b>Neutral Third-Party Campus &amp; Youth Event Aggregator</b><br/>"
                      "A unified weekly discovery timetable, 1-tap calendar sync, and streamlined submission engine.", subtitle_style)
        ],
        [
            Spacer(1, 2)
        ],
        [
            Paragraph("<b>Classification:</b> Independent 3rd-Party Platform &nbsp;|&nbsp; "
                      "<b>Cycle:</b> Friday Cutoff / Monday Blast &nbsp;|&nbsp; "
                      "<b>Target Audience:</b> University Students &amp; Youth", 
                      ParagraphStyle('BMeta', fontName='Helvetica', fontSize=7.5, textColor=colors.HexColor("#64748B")))
        ]
    ]
    
    banner_table = Table(banner_data, colWidths=[content_width])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,-1), (-1,-1), 8),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 10))

    # Section 1
    story.append(Paragraph("1. Problem Statement &amp; The Sidequestki Solution", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=6))
    
    story.append(Paragraph(
        "<b>The Campus Information Breakdown:</b> In university ecosystems, event dissemination is plagued by severe "
        "fragmentation across hundreds of ephemeral WhatsApp group chats, private Telegram channels, and 24-hour Instagram stories. "
        "Valuable workshops, talks, competitions, and club gatherings are drowned out by spam. Consequently, students suffer from "
        "severe discovery friction, while student clubs struggle to reach attendee quotas despite exhausting marketing efforts.",
        body_style
    ))
    
    story.append(Paragraph(
        "<b>Why Traditional Workarounds (Linktree + PDF) Fail:</b><br/>"
        "• <i>Pinch-and-Zoom Mobile Friction:</i> Static PDF timetables on mobile screens force users into awkward horizontal dragging and micro-zooming.<br/>"
        "• <i>Zero Behavioral Stickiness:</i> Static PDFs do not integrate with device calendars. Students view a flyer on Monday and forget it by Thursday.<br/>"
        "• <i>Generic Perception:</i> Standard Linktree pages appear as generic social media aggregators rather than a purpose-built discovery tool.",
        body_style
    ))

    story.append(Paragraph(
        "<b>The Sidequestki Model:</b> A permanent mobile-responsive <b>Quest Board</b> linked to a single, static QR code. "
        "Events are rendered as interactive, day-by-day cards featuring 1-tap registration buttons, value tags (Workshops, Sports, Free Food, E-Certificates), "
        "and direct <b>'+ Add to Calendar'</b> synchronization (Google / Apple Calendar) with automatic 1-hour pre-event alerts.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # Section 2
    story.append(Paragraph("2. Third-Party Positioning &amp; Neutrality Policy", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=6))
    
    story.append(Paragraph(
        "Sidequestki operates as an <b>autonomous, third-party aggregator</b> entirely independent of institutional bureaucracy. "
        "This independent positioning is critical for three operational reasons:<br/>"
        "<b>1. Zero Red Tape:</b> Eliminates multi-layered administrative approvals, enabling rapid weekly turnarounds.<br/>"
        "<b>2. Inclusive Curation:</b> Aggregates from all bodies—faculty societies, residential colleges, sports clubs, interest groups, and verified external youth NGOs.<br/>"
        "<b>3. Editorial Agility:</b> Full control over formatting, curation quality, and student-first presentation.",
        body_style
    ))

    disclaimer_text = (
        "<b>Standard Public Disclaimer (Displayed on Web Hub &amp; Forms):</b><br/>"
        "<i>'Sidequestki is an independent student event curation platform. We are not affiliated with, endorsed by, "
        "or responsible for the administration, fee collection, ticketing, venue changes, or cancellations of listed events. "
        "For event-specific questions, please contact the respective organizing body directly.'</i>"
    )
    disclaimer_table = Table([[Paragraph(disclaimer_text, callout_style)]], colWidths=[content_width])
    disclaimer_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF3C7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#F59E0B")),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(disclaimer_table)

    # PAGE BREAK TO PAGE 2
    story.append(PageBreak())

    # =========================================================
    # PAGE 2: OPERATIONAL RHYTHM, POLICIES & INTAKE SPEC
    # =========================================================
    story.append(Paragraph("3. The Weekly Operating Rhythm (The 7-Day Engine)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=6))
    
    story.append(Paragraph(
        "To establish a dependable routine for both student attendees and club organizers, Sidequestki runs on an invariable weekly cycle:",
        body_style
    ))

    rhythm_data = [
        [Paragraph("Window", table_header), Paragraph("Cycle Stage", table_header), Paragraph("Key Responsibilities &amp; Deliverables", table_header)],
        [
            Paragraph("<b>Mon – Fri</b><br/>(11:59 PM)", table_cell),
            Paragraph("<b>Intake Window</b>", table_cell_bold),
            Paragraph("Standard intake form is active. Organizers submit event logistics, registration links, and promotional pitches.", table_cell)
        ],
        [
            Paragraph("<b>Friday 11:59 PM</b><br/>(Hard Cutoff)", table_cell),
            Paragraph("<b>Intake Lock</b>", table_cell_bold),
            Paragraph("Submissions for the upcoming week close strictly. Late entries are systematically deferred to prevent operational disruption.", table_cell)
        ],
        [
            Paragraph("<b>Sat – Sun</b><br/>(Weekend)", table_cell),
            Paragraph("<b>Curation &amp; QA</b>", table_cell_bold),
            Paragraph("Admin tests links for public access, formats event text, assigns loot tags, and marks rows as 'APPROVED' in Google Sheets.", table_cell)
        ],
        [
            Paragraph("<b>Monday 8:00 AM</b><br/>(Blast Time)", table_cell),
            Paragraph("<b>The Monday Blast</b>", table_cell_bold),
            Paragraph("The live web hub updates automatically. Announcement blast released across social media. Featured organizers tagged for reposting.", table_cell)
        ],
        [
            Paragraph("<b>Mon – Sun</b><br/>(Active Week)", table_cell),
            Paragraph("<b>Student Action</b>", table_cell_bold),
            Paragraph("Students explore the timetable, add items to personal calendars, and register. Past events automatically hide from the active view.", table_cell)
        ]
    ]

    rhythm_table = Table(rhythm_data, colWidths=[85, 105, 325])
    rhythm_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E293B")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(rhythm_table)
    story.append(Spacer(1, 8))

    # Section 4
    story.append(Paragraph("4. Submission Policies &amp; Advance Lead-Time Rules", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=6))
    
    rules_data = [
        [
            Paragraph("<b>The 'Next Week' Standard:</b> If an event takes place between <b>Monday and Sunday of next week</b>, the complete submission must be submitted by <b>Friday at 11:59 PM</b>.", table_cell),
            Paragraph("<b>Advance Queueing:</b> Organizers can submit events 2 to 4 weeks in advance. The master database queues them and automatically displays them during their event week.", table_cell)
        ],
        [
            Paragraph("<b>Strict Late Rollover:</b> Submissions received after Friday midnight are <b>never</b> added to Monday's blast. If the event remains active in future weeks, it rolls over automatically.", table_cell),
            Paragraph("<b>Public Link Mandate:</b> Registration forms must be tested for public permission (e.g. no Google Workspace permission errors). Dead links result in immediate rejection.", table_cell)
        ]
    ]
    rules_table = Table(rules_data, colWidths=[255, 260])
    rules_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [colors.HexColor("#F8FAFC")]),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(rules_table)
    story.append(Spacer(1, 8))

    # Section 5
    story.append(Paragraph("5. Event Intake Form Specification (11 Core Fields)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=6))

    intake_fields = [
        [Paragraph("#", table_header), Paragraph("Field Name", table_header), Paragraph("Type", table_header), Paragraph("Operational Purpose &amp; Validation Standard", table_header)],
        [Paragraph("1", table_cell), Paragraph("Event Title", table_cell_bold), Paragraph("Text", table_cell), Paragraph("Clean name displayed as the headline of the timetable card.", table_cell)],
        [Paragraph("2", table_cell), Paragraph("Organizing Body", table_cell_bold), Paragraph("Text", table_cell), Paragraph("Name of club, faculty society, or external youth community.", table_cell)],
        [Paragraph("3", table_cell), Paragraph("Event Date(s)", table_cell_bold), Paragraph("Date", table_cell), Paragraph("Start date and concluding date for chronological sorting.", table_cell)],
        [Paragraph("4", table_cell), Paragraph("Time Slot", table_cell_bold), Paragraph("Text", table_cell), Paragraph("Exact duration (e.g., '2:00 PM – 5:00 PM' or '8:30 AM – 1:00 PM').", table_cell)],
        [Paragraph("5", table_cell), Paragraph("Venue / Mode", table_cell_bold), Paragraph("Text", table_cell), Paragraph("Physical room/auditorium or virtual platform link.", table_cell)],
        [Paragraph("6", table_cell), Paragraph("Target Group", table_cell_bold), Paragraph("Dropdown", table_cell), Paragraph("Target audience filter: All Students, Faculty-Only, Public.", table_cell)],
        [Paragraph("7", table_cell), Paragraph("Registration URL", table_cell_bold), Paragraph("URL", table_cell), Paragraph("Direct public link (Google Form, external ticketing, RSVP page).", table_cell)],
        [Paragraph("8", table_cell), Paragraph("20-Word Pitch", table_cell_bold), Paragraph("Text", table_cell), Paragraph("Quick hook highlighting what attendees will gain.", table_cell)],
        [Paragraph("9", table_cell), Paragraph("Loot Badges", table_cell_bold), Paragraph("Multi-select", table_cell), Paragraph("Free Food, E-Certificate, Activity Merits, Free Admission.", table_cell)],
        [Paragraph("10", table_cell), Paragraph("PIC WhatsApp", table_cell_bold), Paragraph("Phone", table_cell), Paragraph("Mandatory organizer phone number for instant link fixes.", table_cell)],
        [Paragraph("11", table_cell), Paragraph("Cutoff Acknowledge", table_cell_bold), Paragraph("Checkbox", table_cell), Paragraph("Organizer confirms agreement with the Friday 11:59 PM deadline.", table_cell)]
    ]
    
    intake_table = Table(intake_fields, colWidths=[18, 105, 62, 330])
    intake_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E293B")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('PADDING', (0,0), (-1,-1), 3.8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(intake_table)

    # PAGE BREAK TO PAGE 3
    story.append(PageBreak())

    # =========================================================
    # PAGE 3: TECH ARCHITECTURE, VIRAL GROWTH & ROADMAP
    # =========================================================
    story.append(Paragraph("6. Technical Architecture (Zero-Code, Zero-Cost Stack)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=6))
    
    story.append(Paragraph(
        "Sidequestki is engineered as a high-reliability, zero-cost pipeline. It requires no server hosting fees and allows the admin to manage everything from a smartphone:",
        body_style
    ))

    tech_data = [
        [Paragraph("Layer", table_header), Paragraph("Tool / Service", table_header), Paragraph("Cost", table_header), Paragraph("Operational Function &amp; Advantages", table_header)],
        [
            Paragraph("<b>Intake Layer</b>", table_cell),
            Paragraph("Google Forms / Tally", table_cell_bold),
            Paragraph("Free", table_cell),
            Paragraph("Presents a clean mobile submission UI with mandatory field validation.", table_cell)
        ],
        [
            Paragraph("<b>Database Layer</b>", table_cell),
            Paragraph("Google Sheets (Master CMS)", table_cell_bold),
            Paragraph("Free", table_cell),
            Paragraph("Acts as the centralized database. Toggling a row to 'APPROVED' publishes it live immediately.", table_cell)
        ],
        [
            Paragraph("<b>Frontend App</b>", table_cell),
            Paragraph("Static Web App (GitHub / Vercel)", table_cell_bold),
            Paragraph("Free", table_cell),
            Paragraph("High-speed mobile layout. Features day tabs, category filters, and automated 1-tap calendar sync.", table_cell)
        ],
        [
            Paragraph("<b>Offline Bridge</b>", table_cell),
            Paragraph("Permanent Vector QR Code", table_cell_bold),
            Paragraph("Free", table_cell),
            Paragraph("Printed on physical campus posters. The QR code never changes; the schedule updates dynamically.", table_cell)
        ]
    ]
    tech_table = Table(tech_data, colWidths=[75, 120, 35, 285])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E293B")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 8))

    # Section 7
    story.append(Paragraph("7. 'The Monday Blast' &amp; Viral Flywheel Engine", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=6))
    
    story.append(Paragraph(
        "<b>1. Multi-Channel Blast:</b> Released every Monday between 8:00 AM – 10:00 AM across Instagram, Telegram, and WhatsApp broadcast channels.<br/>"
        "<b>2. The Organizer Repost Hack:</b> In every blast story, tag the official Instagram/social handles of all featured clubs. Organizers will enthusiastically "
        "repost your announcement to their own member bases, generating compounding free organic reach.<br/>"
        "<b>3. Retention via Calendar Sync:</b> The '+ Add to Calendar' button embeds the event into students' native phone calendars with a 1-hour notification, "
        "eliminating attendance drop-off without requiring manual push notifications.<br/>"
        "<b>4. Physical 'Bounty Board' Posters:</b> Eye-catching posters placed on cafeteria noticeboards, faculty bus stops, and library pillars drive permanent top-of-funnel traffic.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # Section 8
    story.append(Paragraph("8. Operational Risk Management &amp; Contingencies", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=6))

    risk_data = [
        [Paragraph("Identified Risk", table_header), Paragraph("Preventative Protocol &amp; Remediation Plan", table_header)],
        [
            Paragraph("<b>Broken / Restricted Link</b>", table_cell_bold),
            Paragraph("Flagged during weekend review. Admin alerts the PIC via WhatsApp. If unresolved by Sunday 6:00 PM, the entry is delisted.", table_cell)
        ],
        [
            Paragraph("<b>Last-Minute Postponement</b>", table_cell_bold),
            Paragraph("Admin changes the status in Google Sheets to '[POSTPONED]'. The live web card updates in real time with zero reprint costs.", table_cell)
        ],
        [
            Paragraph("<b>Commercial / Scam Events</b>", table_cell_bold),
            Paragraph("Commercial schemes or suspicious external pitches are filtered during curation. Only bona fide student and youth events are approved.", table_cell)
        ]
    ]
    risk_table = Table(risk_data, colWidths=[140, 375])
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E293B")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(risk_table)
    story.append(Spacer(1, 8))

    # Section 9
    story.append(Paragraph("9. Launch Implementation Roadmap", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=6))

    roadmap_data = [
        [Paragraph("Phase", table_header), Paragraph("Milestone Deliverables &amp; Core Actions", table_header), Paragraph("Status", table_header)],
        [
            Paragraph("<b>Phase 1: Setup</b><br/>(Days 1–3)", table_cell),
            Paragraph("Build Google Intake Form (11 fields) &bull; Set up Google Sheet CMS &bull; Generate permanent QR code.", table_cell),
            Paragraph("Immediate Action", table_cell_bold)
        ],
        [
            Paragraph("<b>Phase 2: Web App</b><br/>(Days 4–6)", table_cell),
            Paragraph("Deploy mobile-responsive web hub on GitHub Pages/Vercel &bull; Connect live Google Sheet auto-sync.", table_cell),
            Paragraph("Technical Task", table_cell_bold)
        ],
        [
            Paragraph("<b>Phase 3: Pilot Intake</b><br/>(First Friday)", table_cell),
            Paragraph("Onboard first 5–10 campus clubs &bull; Enforce Friday 11:59 PM cutoff &bull; Review &amp; approve pilot queue.", table_cell),
            Paragraph("Operational Pilot", table_cell_bold)
        ],
        [
            Paragraph("<b>Phase 4: Go-Live</b><br/>(First Monday)", table_cell),
            Paragraph("Execute first official Monday Blast &bull; Tag featured clubs &bull; Distribute physical campus QR posters.", table_cell),
            Paragraph("Full Launch", table_cell_bold)
        ]
    ]
    roadmap_table = Table(roadmap_data, colWidths=[90, 340, 85])
    roadmap_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E293B")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(roadmap_table)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Master Blueprint successfully written to {filename}")

if __name__ == '__main__':
    create_pdf()
