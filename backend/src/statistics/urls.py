from django.urls import path
from .views import available_years, yearly_statistics, monthly_statistics, weekly_statistics, entity_count, top_selling_drugs, soon_expiring_drugs, drug_status_statistics
urlpatterns = [
    path('available-years', available_years),
    path('yearly', yearly_statistics),
    path('monthly', monthly_statistics),
    path('weekly', weekly_statistics),
    path('entity-count', entity_count),
    path("top-selling-drugs", top_selling_drugs),
    path("soon-expiring", soon_expiring_drugs),
    path("drug-status", drug_status_statistics),
]
