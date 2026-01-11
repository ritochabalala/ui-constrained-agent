from django.db import models
import uuid

# Create your models here.

class ReservationSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    party_size = models.IntegerField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    time = models.TimeField(null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    
    current_step = models.CharField(max_length=50, default='greeting')
    confidence = models.FloatField(default=1.0)
    completed = models.BooleanField(default=False)
    
    def get_progress_percentage(self):
        fields = ['party_size', 'date', 'time', 'name', 'phone']
        completed_fields = sum(1 for field in fields if getattr(self, field) is not None)
        return min(100, int((completed_fields / len(fields)) * 100))