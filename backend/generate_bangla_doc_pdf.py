import os
import urllib.request
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def setup_font():
    font_path = "/app/fonts/NotoSansBengali-Regular.ttf"
    if not os.path.exists(font_path):
        url = "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf"
        os.makedirs(os.path.dirname(font_path), exist_ok=True)
        urllib.request.urlretrieve(url, font_path)
    
    if os.path.exists(font_path):
        try:
            pdfmetrics.registerFont(TTFont('BanglaFont', font_path))
            return 'BanglaFont'
        except Exception as e:
            print(f"Error registering font: {e}")
    return 'Helvetica'


class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#6b7280"))
        
        # Header (on page > 1)
        if self._pageNumber > 1:
            self.drawString(40, 805, "FinTrack - Income & Expense Tracker | Documentation")
            self.setStrokeColor(colors.HexColor("#e5e7eb"))
            self.setLineWidth(0.5)
            self.line(40, 800, 555, 800)
            
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(555, 30, page_text)
        self.drawString(40, 30, "Confidential & Proprietary - FinTrack Project Documentation")
        self.setStrokeColor(colors.HexColor("#e5e7eb"))
        self.setLineWidth(0.5)
        self.line(40, 42, 555, 42)
        self.restoreState()


def generate_pdf(output_pdf_path):
    font_name = setup_font()
    
    os.makedirs(os.path.dirname(output_pdf_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        fontName=font_name,
        fontSize=22,
        leading=28,
        textColor=colors.HexColor("#14532d"),
        spaceAfter=6,
        alignment=1 # Center
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName=font_name,
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#15803d"),
        spaceAfter=15,
        alignment=1 # Center
    )

    h1_style = ParagraphStyle(
        'Heading1_Bangla',
        fontName=font_name,
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#166534"),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Bangla',
        fontName=font_name,
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#1f2937"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Bangla',
        fontName=font_name,
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#374151"),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Bangla',
        fontName=font_name,
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#4b5563"),
        leftIndent=15,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'Code_Block',
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#f1f5f9"),
        borderColor=colors.HexColor("#cbd5e1"),
        borderWidth=0.5,
        borderPadding=6,
        spaceAfter=8
    )

    story = []
    
    # Title Banner
    story.append(Paragraph("FinTrack (ফিনট্র্যাক) - আয় ও ব্যয় ট্র্যাকার", title_style))
    story.append(Paragraph("পূর্ণাঙ্গ বাংলা ডকুমেন্টেশন ও সিস্টেম আর্কিটেকচার গাইড", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#16a34a"), spaceAfter=12))

    # Section 1: Overview
    story.append(Paragraph("১. ভূমিকা ও পরিচিতি (Introduction)", h1_style))
    story.append(Paragraph(
        "FinTrack হলো একটি আধুনিক, স্কেলেবল এবং অত্যন্ত সুরক্ষিত ফুল-স্ট্যাক পার্সোনাল ফাইন্যান্স ম্যানেজমেন্ট প্ল্যাটফর্ম। "
        "এর মাধ্যমে একজন ব্যবহারকারী তার সমস্ত ব্যাংক অ্যাকাউন্ট, নগদ টাকা, কার্ড ও ওয়ালেটের দৈনন্দিন আয়-ব্যয় নিখুঁতভাবে সংরক্ষণ, "
        "বাজেট নিয়ন্ত্রণ এবং স্বয়ংক্রিয় এনালিটিক্স তৈরি করতে পারেন। সম্পূর্ণ সিস্টেমটি বাংলাদেশী টাকা (৳ BDT) কারেন্সিতে ডিফল্টভাবে সাজানো।",
        body_style
    ))

    # Section 2: Tech Stack Table
    story.append(Paragraph("২. ব্যবহৃত প্রযুক্তি ও স্ট্যাক (Technology Stack)", h1_style))
    
    table_data = [
        [Paragraph("<b>স্তর (Layer)</b>", body_style), Paragraph("<b>ব্যবহৃত প্রযুক্তি</b>", body_style), Paragraph("<b>দায়িত্ব ও বিবরণ</b>", body_style)],
        [Paragraph("<b>Frontend</b>", body_style), Paragraph("React 18, TypeScript, Tailwind CSS", body_style), Paragraph("দ্রুতগতির রেসপনসিভ ইউজার ইন্টারফেস ও ইন্টারেক্টিভ ফর্ম।", body_style)],
        [Paragraph("<b>State & Query</b>", body_style), Paragraph("Zustand, TanStack Query", body_style), Paragraph("টোকেন অথেনটিকেশন স্টেট ও রিয়েলটাইম সার্ভার ডাটা ক্যাশিং।", body_style)],
        [Paragraph("<b>Backend API</b>", body_style), Paragraph("FastAPI, Python 3.12, Pydantic V2", body_style), Paragraph("হাই-পারফরম্যান্স অ্যাসিনক্রোনাস REST API এন্ডপয়েন্ট।", body_style)],
        [Paragraph("<b>Database</b>", body_style), Paragraph("PostgreSQL 16, SQLAlchemy 2.0", body_style), Paragraph("UUID ও Numeric(15,2) ডেসিমাল দিয়ে নির্ভুল হিসাব সংরক্ষণ।", body_style)],
        [Paragraph("<b>Migrations</b>", body_style), Paragraph("Alembic", body_style), Paragraph("ডাটাবেজ স্কিমার সংস্করণ নিয়ন্ত্রণ ও অটোমেটিক মাইগ্রেশন।", body_style)],
        [Paragraph("<b>Reverse Proxy</b>", body_style), Paragraph("Nginx", body_style), Paragraph("পোর্ট ৮০ তে একক গেটওয়ে, সিকিউরিটি হেডার ও SPA রাউটিং।", body_style)],
        [Paragraph("<b>Container</b>", body_style), Paragraph("Docker & Docker Compose", body_style), Paragraph("এক কমান্ডে মাল্টি-কন্টেইনার প্রডাকশন ডিপ্লয়মেন্ট।", body_style)],
    ]
    
    col_widths = [85, 160, 270]
    stack_table = Table(table_data, colWidths=col_widths, repeatRows=1)
    stack_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f0fdf4")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#166534")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(stack_table)
    story.append(Spacer(1, 10))

    # Section 3: How it works Architecture
    story.append(Paragraph("৩. সিস্টেম আর্কিটেকচার ও ডেটা প্রবাহ (Architecture & Workflow)", h1_style))
    story.append(Paragraph(
        "সিস্টেমটি সম্পূর্ণ লেয়ার্ড এবং ডিকাপলড আর্কিটেকচার অনুসরণ করে:",
        body_style
    ))
    story.append(Paragraph("• <b>Nginx Reverse Proxy:</b> সমস্ত রিকোয়েস্ট পোর্ট ৮০-তে গ্রহণ করে। /api/* রিকোয়েস্ট ব্যাকএন্ড কন্টেইনারে এবং বাকি সবকিছু রিঅ্যাক্ট ফ্রন্টএন্ডে পাঠায়।", bullet_style))
    story.append(Paragraph("• <b>Router → Service → Repository প্যাটার্ন:</b> রুট হ্যান্ডলারে কোনো বিজনেস লজিক রাখা হয় না। সার্ভিস লেয়ারে ব্যালেন্স হিসাব ও ভ্যালিডেশন হয় এবং রিপোজিটরি সরাসরি ডাটাবেজের সাথে যোগাযোগ করে।", bullet_style))
    story.append(Paragraph("• <b>নিখুঁত ব্যালেন্স ক্যালকুলেশন:</b> প্রতিটি ট্রানজেকশন তৈরি, পরিবর্তন বা মুছে ফেলার সাথে সাথে সংশ্লিষ্ট অ্যাকাউন্টের ব্যালেন্স পরমাণুভাবে (Atomically) আপডেট হয়।", bullet_style))

    # Section 4: Features
    story.append(Paragraph("৪. মূল মডিউল ও ফিচারসমূহ (Core Features)", h1_style))
    
    story.append(Paragraph("<b>১. নিরাপত্তা ও অথেনটিকেশন (Authentication):</b>", h2_style))
    story.append(Paragraph("JWT Access Token (৩০ মিনিট) এবং Refresh Token (৭ দিন) ভিত্তিক অথেনটিকেশন। প্রতিটি কুয়েরিতে ইউজার ডাটা আইসোলেশন ও IDOR সুরক্ষা প্রয়োগ করা হয়েছে।", bullet_style))

    story.append(Paragraph("<b>২. আর্থিক ড্যাশবোর্ড (Financial Dashboard):</b>", h2_style))
    story.append(Paragraph("৬টি কেপিআই কার্ড (মোট ব্যালেন্স, আয়, ব্যয়, নিট সঞ্চয়, চলতি মাসের হিসাব), বাৎসরিক আয়ের সাথে ব্যয়ের তুলনামূলক চার্ট, ক্যাটাগরি পাই-চার্ট এবং বাজেট মনিটর।", bullet_style))

    story.append(Paragraph("<b>৩. অ্যাকাউন্ট ও ট্রান্সফার (Accounts & Transfers):</b>", h2_style))
    story.append(Paragraph("ক্যাশ, ব্যাংক, সেভিংস, কার্ড ও মোবাইল ওয়ালেট ম্যানেজমেন্ট। দুই অ্যাকাউন্টের মাঝে সরাসরি ফান্ড ট্রান্সফারের ব্যবস্থা যা আয়ের বা ব্যয়ের মোট অংক বিকৃত করে না।", bullet_style))

    story.append(Paragraph("<b>৪. আয়-ব্যয় লেনদেন ও ক্যাটাগরি (Transactions & Categories):</b>", h2_style))
    story.append(Paragraph("ইমোজি আইকন ও কালার সহ কাস্টম ক্যাটাগরি তৈরি। তারিখ, অ্যামাউন্ট ও ক্যাটাগরি ভিত্তিক সার্চ এবং মাল্টি-লেভেল ফিল্টার সুবিধা।", bullet_style))

    story.append(Paragraph("<b>৫. মাসিক বাজেট ট্র্যাকিং (Budget Management):</b>", h2_style))
    story.append(Paragraph("ক্যাটাগরি ভিত্তিক খরচ সীমা নির্ধারণ। খরচ ৮০% ছাড়ালে হলুদ সতর্কতা এবং ১০০% অতিক্রম করলে লাল ওভার-বাজেট নোটিফিকেশন।", bullet_style))

    story.append(Paragraph("<b>৬. রিপোর্ট ও ডাউনলোড (Reports & Exports):</b>", h2_style))
    story.append(Paragraph("যেকোনো সময়সীমার জন্য লেনদেনের পূর্ণাঙ্গ CSV, এক্সেল (.xlsx) এবং প্রিন্টেবল PDF রিপোর্ট তাৎক্ষণিক ডাউনলোড করার সুবিধা।", bullet_style))

    # Section 5: Security & Financial Integrity
    story.append(Paragraph("৫. আর্থিক বিশুদ্ধতা ও নিরাপত্তা নীতি (Financial Integrity)", h1_style))
    story.append(Paragraph("• <b>No Floating-Point Math:</b> কখনো ফ্লোটিং পয়েন্ট ব্যবহার করা হয় না। ডাটাবেজে Decimal / Numeric(15,2) ব্যবহার নিশ্চিত করা হয়েছে।", bullet_style))
    story.append(Paragraph("• <b>IDOR Prevention:</b> এক ব্যবহারকারী কখনো অন্য ব্যবহারকারীর কোনো ডাটা দেখতে বা পরিবর্তন করতে পারে না।", bullet_style))
    story.append(Paragraph("• <b>Nginx Hardening:</b> X-Frame-Options, X-Content-Type-Options, Gzip কম্প্রেশন সক্রিয়।", bullet_style))

    # Section 6: How to Run
    story.append(Paragraph("৬. কীভাবে অ্যাপ্লিকেশন চালাবেন (Deployment & Run Guide)", h1_style))
    story.append(Paragraph("ডকার কম্পোজ দিয়ে চালাতে নিচের কমান্ডটি টার্মিনালে রান করুন:", body_style))
    story.append(Paragraph(
        "cd \"e:\\Antigravity Projects\\First APP\\Templates\\income-expense-tracker\"<br/>"
        "docker compose up -d --build",
        code_style
    ))
    story.append(Paragraph("ব্রাউজারে অ্যাক্সেস করুন:", body_style))
    story.append(Paragraph("• <b>ওয়েব অ্যাপ্লিকেশন:</b> http://localhost", bullet_style))
    story.append(Paragraph("• <b>সোয়াগার API ডকুমেন্টেশন:</b> http://localhost/docs", bullet_style))
    story.append(Paragraph("• <b>ডেমো লগইন:</b> demo@example.com / Demo@12345", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully created at: {output_pdf_path}")

if __name__ == "__main__":
    output_path = "/app/docs/FinTrack_Bangla_Documentation.pdf"
    generate_pdf(output_path)
