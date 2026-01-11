from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ReservationSession
from .serializers import ReservationSessionSerializer
from datetime import datetime
import uuid

@api_view(['POST'])
def start_session(request):
    session = ReservationSession.objects.create()
    serializer = ReservationSessionSerializer(session)
    return Response(serializer.data)

@api_view(['POST'])
def handle_input(request, session_id):
    try:
        session = ReservationSession.objects.get(id=session_id)
    except ReservationSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=404)
    
    user_input = request.data.get('input', '').strip()
    field = request.data.get('field', '')
    
    # State machine logic
    if session.current_step == 'greeting':
        session.current_step = 'party_size'
        session.confidence = 0.95
    elif session.current_step == 'party_size':
        try:
            size = int(user_input)
            if 1 <= size <= 20:
                session.party_size = size
                session.current_step = 'date'
                session.confidence = 0.9
            else:
                session.confidence = 0.3
        except ValueError:
            session.confidence = 0.4
    elif session.current_step == 'date':
        try:
            date_obj = datetime.strptime(user_input, '%Y-%m-%d').date()
            today = datetime.today().date()
            if date_obj >= today and (date_obj - today).days <= 90:
                session.date = date_obj
                session.current_step = 'time'
                session.confidence = 0.85
            else:
                session.confidence = 0.5
        except ValueError:
            session.confidence = 0.4
    elif session.current_step == 'time':
        try:
            time_obj = datetime.strptime(user_input, '%H:%M').time()
            if 11 <= time_obj.hour <= 22:
                session.time = time_obj
                session.current_step = 'name'
                session.confidence = 0.9
            else:
                session.confidence = 0.7
        except ValueError:
            session.confidence = 0.4
    elif session.current_step == 'name':
        if len(user_input) >= 2:
            session.name = user_input
            session.current_step = 'phone'
            session.confidence = 0.95
        else:
            session.confidence = 0.5
    elif session.current_step == 'phone':
        clean_phone = ''.join(filter(str.isdigit, user_input))
        if len(clean_phone) >= 10:
            session.phone = clean_phone
            session.current_step = 'confirmation'
            session.confidence = 0.98
        else:
            session.confidence = 0.6
    elif session.current_step == 'confirmation':
        if user_input.lower() in ['yes', 'y', 'confirm']:
            session.completed = True
            session.current_step = 'completed'
            session.confidence = 1.0
        else:
            # Reset to beginning but keep memory? Or just restart step?
            session.current_step = 'party_size'
            session.confidence = 0.8
    
    session.save()
    
    # Generate response
    responses = {
        'greeting': "Welcome! Let's book your table.",
        'party_size': "How many guests? (1-20)",
        'date': "What date? (YYYY-MM-DD)",
        'time': "What time? (HH:MM, 11AM-10PM)",
        'name': "Your name?",
        'phone': "Your phone number?",
        'confirmation': f"Confirm: {session.party_size} on {session.date} at {session.time}? (Yes/No)",
        'completed': "Reservation confirmed! See you soon."
    }
    
    base = responses.get(session.current_step, "Please continue.")
    if session.confidence < 0.7:
        base += " [?] Sure?"
    agent_response = base[:120]
    
    serializer = ReservationSessionSerializer(session)
    return Response({
        'session': serializer.data,
        'agent_response': agent_response
    })