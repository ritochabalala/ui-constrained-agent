from django.urls import path
from . import views

urlpatterns = [
    path('session/start/', views.start_session),
    path('session/<uuid:session_id>/input/', views.handle_input),
]