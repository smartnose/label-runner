package wws.labelling.engine

import org.scalatest.{Matchers, WordSpec}
import wws.labeling.engine.Engine

/**
  * Created by weil1 on 11/27/16.
  */
class EngineSpec extends WordSpec with Matchers {
  import wws.tokenization.Lexer._
  "engine should tokenize" in {
    tokenize("hello world") shouldBe List(("hello", 0, 4), ("world", 6, 10))
    tokenize(" a b c ") shouldBe List(("a", 1, 1), ("b", 3, 3), ("c", 5, 5))
    tokenize("a") shouldBe List(("a", 0, 0))
    tokenize("\ta") shouldBe List(("a", 1, 1))
    tokenize("") shouldBe List.empty[(String, Int, Int)]
    tokenize("    ") shouldBe List.empty[(String, Int, Int)]
    tokenize("\t") shouldBe List.empty[(String, Int, Int)]
  }

  def tokenize(query: String): List[(String, Int, Int)] = {
    Engine.tokenize(query).map(token2Tuple)
  }

  def token2Tuple(tm: TokenMatch) = {
    (tm.token.chars, tm.start.offset, tm.end.offset)
  }
}
