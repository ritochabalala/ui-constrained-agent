from rest_framework import serializers
from .models import ReservationSession

class ReservationSessionSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = ReservationSession
        fields = [
            'id', 'party_size', 'date', 'time', 'name', 'phone', 'email',
            'current_step', 'confidence', 'completed', 'progress_percentage'
        ]
    
    def get_progress_percentage(self, obj):
        return obj.get_progress_percentage()