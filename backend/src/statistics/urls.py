from django.urls import path
from .views import available_years, yearly_statistics, monthly_statistics, weekly_statistics, entity_count, top_selling_drugs

urlpatterns = [
    path('available-years', available_years),
    path('yearly', yearly_statistics),
    path('monthly', monthly_statistics),
    path('weekly', weekly_statistics),
    path('entity-count', entity_count),
    path("top-selling-drugs", top_selling_drugs),
]
