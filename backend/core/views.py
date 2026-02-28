from rest_framework import generics
from api.models import CoilEntry
from api.serializers import CoilEntrySerializer
from django.http import HttpResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import pagesizes
from io import BytesIO
from datetime import date
from api.models import CoilEntry
from django.db.models import Sum
from django.http import JsonResponse
from django.db.models import Sum
from django.db.models.functions import TruncDate

SECRET_TOKEN = "mysecret123"


class CoilEntryCreateView(generics.CreateAPIView):
    queryset = CoilEntry.objects.all()
    serializer_class = CoilEntrySerializer


def daily_report_pdf(request):
    today = date.today()
    entries = CoilEntry.objects.filter(created_at__date=today)

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=pagesizes.A4)
    elements = []

    styles = getSampleStyleSheet()
    elements.append(Paragraph(f"Daily Coil Report - {today}", styles["Title"]))
    elements.append(Spacer(1, 20))

    data = [
        ["Operator", "Coil No", "Source", "Size", "OK", "Hold", "Reject", "Diagonal"]
    ]

    for entry in entries:
        data.append([
            entry.operator_name,
            entry.coil_no,
            entry.source,
            entry.size,
            entry.ok_count,
            entry.hold_count,
            entry.rejection_count,
            entry.diagonal_count,
        ])

    table = Table(data)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("ALIGN", (4, 1), (-1, -1), "CENTER"),
    ]))

    elements.append(table)
    doc.build(elements)

    buffer.seek(0)
    return HttpResponse(buffer, content_type="application/pdf")


def analytics_view(request, token):
    if token != SECRET_TOKEN:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    totals = CoilEntry.objects.aggregate(
        total_ok=Sum("ok_count"),
        total_hold=Sum("hold_count"),
        total_reject=Sum("rejection_count"),
        total_diagonal=Sum("diagonal_count"),
    )

    operator_data = (
        CoilEntry.objects
        .values("operator_name")
        .annotate(total_ok=Sum("ok_count"))
    )

    daily_trend = (
        CoilEntry.objects
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(total_ok=Sum("ok_count"))
        .order_by("day")
    )

    return JsonResponse({
        "totals": totals,
        "operator_data": list(operator_data),
        "daily_trend": list(daily_trend),
    })