from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(request, exception):
    response = exception_handler(request, exception)

    if response is not None:
        error_msg = response.data

        if isinstance(error_msg, str):
            error_msg = {'detail': error_msg}
        elif not isinstance(error_msg, dict):
            error_msg = {'detail': 'An error occured.'}

        error_msg = error_msg.get('detail', error_msg)

        return Response({
            'success': False,
            'error': error_msg
        }, status=response.status_code)

    return Response({
        'success': False,
        'error': 'Internal Server Error'
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)