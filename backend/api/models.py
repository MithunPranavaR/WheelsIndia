from django.db import models

class CoilEntry(models.Model):
    OPERATOR_CHOICES = [
        ('Karthikeyan', 'Karthikeyan'),
        ('Thinakaran', 'Thinakaran'),
        ('Jagan', 'Jagan'),
        ('Sundar', 'Sundar'),
    ]

    SOURCE_CHOICES = [
        ('JSW', 'JSW'),
        ('TATA', 'TATA'),
        ('HYUN', 'HYUN'),
        ('AMNS', 'AMNS'),
    ]

    operator_name = models.CharField(max_length=100, choices=OPERATOR_CHOICES)
    coil_no = models.CharField(max_length=100)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES)
    size = models.CharField(max_length=50)

    ok_count = models.IntegerField()
    hold_count = models.IntegerField()
    rejection_count = models.IntegerField()
    diagonal_count = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.coil_no