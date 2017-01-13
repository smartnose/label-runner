package wws.labeling.chunking

import org.scalatest.{Matchers, WordSpec}
import wws.labeling.chunking.ExtendedTokenizer
import wws.tokenization.Lexer.Token

/**
  * Created by weil1 on 1/12/17.
  */
class ExtendedTokenizerSpec extends WordSpec with Matchers {
  import ExtendedTokens._
  "extended tokenizer should recognize numbers " in {

    assertResult("-1.56", FloatLit("-1.56", -1.56))
    assertResult("-56", IntegerLit("-56", -56))
    assertResult("56", IntegerLit("56", 56))
    assertResult("-56", IntegerLit("-56", -56))
    assertResult("-1.56", FloatLit("-1.56", -1.56))
    assertResult("-1.56e1", FloatLit("-1.56e1", -15.6))
    assertResult("-1.56e2", FloatLit("-1.56e1", -156))
    assertResult("- 1.56e2", FloatLit("-1.56e1", -156))
  }

  def assertResult(text: String, expected: Token): Unit = {
    val actual = parse(text)
    actual.getClass shouldBe expected.getClass
    expected match {
      case IntegerLit(expectedTokenText, actualTokenValue) => assertIntegerMatch(expectedTokenText, actualTokenValue, actual)
      case FloatLit(expectedTokenText, actualTokenValue) => assertFloatMatch(expectedTokenText, actualTokenValue, actual)
      case _ => fail("unexpected token type")
    }
  }

  def assertIntegerMatch(expectedTokenText: String, expectedTokenValue: Int, actual: Token) = {
    actual match {
      case IntegerLit(actualTokenText, actualTokenValue) => {
        actualTokenText shouldBe expectedTokenText
        actualTokenValue shouldBe expectedTokenValue
      }
      case _ => fail("The actual token should be IntegerLit but is not")
    }
  }

  def assertFloatMatch(expectedTokenText: String, expectedTokenValue: Double, actual: Token) = {
    actual match {
      case FloatLit(actualTokenText, actualTokenValue) => {
        actualTokenText shouldBe expectedTokenText
        actualTokenValue shouldBe expectedTokenValue
      }
      case _ => fail("The actual token should be FloatLit but is not")
    }
  }

  def parse(text: String) = ExtendedTokenizer.parse(text)
}
