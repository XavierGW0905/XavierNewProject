
from src.app import main


def test_main(capsys):
    main()

    captured = capsys.readouterr()

    assert captured.out.strip() == "XavierProject is running!"
